const allowedCategories = new Set(['role-based', 'people-process', 'tools-technology']);
const allowedLevels = new Set(['Awareness', 'Basic', 'Intermediate', 'Advanced', 'Expert']);
const sortExpressions = {
  Recommended: 'c.published_at DESC NULLS LAST, c.course_id ASC',
  'A–Z': 'c.title ASC, c.course_id ASC',
  Popular: 'c.published_at DESC NULLS LAST, c.course_id ASC',
  Trending: 'c.published_at DESC NULLS LAST, c.course_id ASC',
};

function durationLabel(minutes) {
  if (minutes % 60 === 0) {
    const hours = minutes / 60;
    return `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`;
  }
  return `${minutes} Minutes`;
}

function baseProgramme(row) {
  const programme = {
    id: row.course_id,
    title: row.title,
    category: row.category_code,
    level: row.level_code,
    duration: durationLabel(row.duration_minutes),
    format: row.format || undefined,
    details: {
      summary: row.summary || undefined,
      delivery: row.delivery || undefined,
      approach: row.approach || undefined,
      format: row.format || undefined,
      toolsCovered: row.tools_covered || [],
    },
  };

  if (row.category_code === 'tools-technology') {
    return {
      ...programme,
      categoryBadge: 'Tool or Technology',
      toolLogoUrl: row.tool_logo_url || '',
      toolName: row.tool_name,
      vendor: row.vendor,
      skillArea: row.skill_area || undefined,
      technologyCategory: row.technology_categories || [],
    };
  }

  if (row.category_code === 'role-based') {
    return {
      ...programme,
      categoryBadge: 'Role-Based Programme',
      imageUrl: row.image_url || '',
      relatedSkills: row.related_skills || [],
      industry: row.industry || undefined,
      department: row.department || undefined,
      functionName: row.function_name || undefined,
      roleTitle: row.role_title || undefined,
    };
  }

  return {
    ...programme,
    badge: 'People and Process',
    topicCategory: row.topic_category || 'People and Process',
    imageUrl: row.image_url || '',
    subType: row.sub_type || undefined,
    portfolio: row.portfolio || undefined,
  };
}

function buildFilters(filters) {
  const conditions = ["c.status = 'published'"];
  const values = [];
  const addValue = (value) => {
    values.push(value);
    return `$${values.length}`;
  };

  if (filters.category) {
    if (!allowedCategories.has(filters.category)) throw new Error('Invalid category filter.');
    conditions.push(`c.category_code = ${addValue(filters.category)}`);
  }
  if (filters.level) {
    if (!allowedLevels.has(filters.level)) throw new Error('Invalid level filter.');
    conditions.push(`c.level_code = ${addValue(filters.level)}`);
  }
  if (filters.tools?.length) conditions.push(`tt.tool_name = ANY(${addValue(filters.tools)}::text[])`);
  if (filters.technologyCategories?.length) {
    conditions.push(`EXISTS (
      SELECT 1 FROM catalogue.course_technology_categories filter_ctc
      WHERE filter_ctc.course_id = c.course_id
        AND filter_ctc.category_name = ANY(${addValue(filters.technologyCategories)}::text[])
    )`);
  }
  if (filters.durationMinutes?.length) {
    conditions.push(`c.duration_minutes = ANY(${addValue(filters.durationMinutes)}::integer[])`);
  }
  if (filters.query) {
    const queryParameter = addValue(filters.query);
    conditions.push(`(
      c.search_document @@ websearch_to_tsquery('simple', ${queryParameter})
      OR c.title ILIKE '%' || ${queryParameter} || '%'
      OR c.course_id ILIKE '%' || ${queryParameter} || '%'
      OR tt.tool_name ILIKE '%' || ${queryParameter} || '%'
      OR tt.vendor ILIKE '%' || ${queryParameter} || '%'
    )`);
  }

  return { whereSql: conditions.join('\nAND '), values };
}

const catalogueSelect = `
  SELECT
    ccv.*
  FROM catalogue.course_catalogue_view ccv
  JOIN catalogue.courses c ON c.course_id = ccv.course_id
  LEFT JOIN catalogue.tools_technology_details tt ON tt.course_id = c.course_id
`;

export async function listCourses(pool, filters) {
  const effectiveFilters = allowedLevels.has(filters.sort) && !filters.level
    ? { ...filters, level: filters.sort }
    : filters;
  const { whereSql, values } = buildFilters(effectiveFilters);
  const page = Math.max(1, filters.page || 1);
  const pageSize = Math.min(100, Math.max(1, filters.pageSize || 24));
  const offset = (page - 1) * pageSize;
  const sortSql = sortExpressions[filters.sort] || (allowedLevels.has(filters.sort)
    ? 'c.title ASC, c.course_id ASC'
    : sortExpressions.Recommended);

  const countSql = `
    SELECT count(*)::integer AS total
    FROM catalogue.courses c
    LEFT JOIN catalogue.tools_technology_details tt ON tt.course_id = c.course_id
    WHERE ${whereSql}
  `;
  const dataSql = `${catalogueSelect}
    WHERE ${whereSql}
    ORDER BY ${sortSql}
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  const [countResult, dataResult] = await Promise.all([
    pool.query(countSql, values),
    pool.query(dataSql, [...values, pageSize, offset]),
  ]);
  const total = countResult.rows[0]?.total || 0;

  return {
    data: dataResult.rows.map(baseProgramme),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
    },
  };
}

export async function getCourseById(pool, courseId) {
  const baseResult = await pool.query(
    `${catalogueSelect} WHERE c.status = 'published' AND c.course_id = $1`,
    [courseId],
  );
  if (baseResult.rowCount === 0) return null;

  const [objectives, audiences, prerequisites, modules, scenarios] = await Promise.all([
    pool.query('SELECT objective FROM catalogue.course_objectives WHERE course_id = $1 ORDER BY display_order', [courseId]),
    pool.query('SELECT audience FROM catalogue.course_audiences WHERE course_id = $1 ORDER BY display_order', [courseId]),
    pool.query('SELECT prerequisite FROM catalogue.course_prerequisites WHERE course_id = $1 ORDER BY display_order', [courseId]),
    pool.query(
      `SELECT m.id, m.module_code, m.title, m.duration_minutes, m.applied_exercise_title,
              m.applied_exercise_content, o.outcome_type, o.outcome, o.display_order AS outcome_order
       FROM catalogue.course_modules m
       LEFT JOIN catalogue.module_learning_outcomes o ON o.module_id = m.id
       WHERE m.course_id = $1
       ORDER BY m.display_order, o.outcome_type, o.display_order`,
      [courseId],
    ),
    pool.query('SELECT title, workflow, content FROM catalogue.course_scenarios WHERE course_id = $1 ORDER BY display_order', [courseId]),
  ]);

  const moduleMap = new Map();
  for (const row of modules.rows) {
    if (!moduleMap.has(row.id)) {
      moduleMap.set(row.id, {
        id: row.module_code,
        title: row.title,
        concepts: [],
        practicalActivities: [],
        learningOutcomes: [],
        ...(row.duration_minutes ? { duration: durationLabel(row.duration_minutes) } : {}),
        ...(row.applied_exercise_title ? {
          appliedExercise: {
            title: row.applied_exercise_title,
            content: row.applied_exercise_content,
          },
        } : {}),
      });
    }
    if (row.outcome) {
      const module = moduleMap.get(row.id);
      module.learningOutcomes.push(row.outcome);
      if (row.outcome_type === 'concept') module.concepts.push(row.outcome);
      if (row.outcome_type === 'practical_activity') module.practicalActivities.push(row.outcome);
    }
  }

  const programme = baseProgramme(baseResult.rows[0]);
  const objectiveList = objectives.rows.map((row) => row.objective);
  programme.details = {
    ...programme.details,
    objective: baseResult.rows[0].objective || objectiveList.join('\n'),
    objectives: objectiveList,
    audience: audiences.rows.map((row) => row.audience),
    prerequisitesList: prerequisites.rows.map((row) => row.prerequisite),
    modules: [...moduleMap.values()],
    scenarios: scenarios.rows.map((row) => ({
      title: row.title,
      workflow: row.workflow || undefined,
      description: row.content,
      content: [row.workflow, row.content].filter(Boolean).join('\n\n'),
    })),
  };

  return programme;
}

export async function getCatalogueFilters(pool, category) {
  if (!allowedCategories.has(category)) throw new Error('Invalid category filter.');
  if (category !== 'tools-technology') return { groups: [] };

  const result = await pool.query(`
    SELECT 'technology' AS group_id, tt.tool_name AS value, count(*)::integer AS count
    FROM catalogue.courses c
    JOIN catalogue.tools_technology_details tt ON tt.course_id = c.course_id
    WHERE c.status = 'published' AND c.category_code = 'tools-technology'
    GROUP BY tt.tool_name
    UNION ALL
    SELECT 'toolCategory', category.category_name, count(*)::integer
    FROM catalogue.courses c
    JOIN catalogue.course_technology_categories category ON category.course_id = c.course_id
    WHERE c.status = 'published' AND c.category_code = 'tools-technology'
    GROUP BY category.category_name
    UNION ALL
    SELECT 'duration', c.duration_minutes::text, count(*)::integer
    FROM catalogue.courses c
    WHERE c.status = 'published' AND c.category_code = 'tools-technology'
    GROUP BY c.duration_minutes
  `);

  const definitions = [
    { id: 'technology', title: 'Technology', initialVisibleCount: 8 },
    { id: 'toolCategory', title: 'Tool Category' },
    { id: 'duration', title: 'Duration' },
  ];

  return {
    groups: definitions.map((definition) => ({
      ...definition,
      allowMultiple: true,
      options: result.rows
        .filter((row) => row.group_id === definition.id)
        .map((row) => ({
          id: definition.id === 'duration' ? durationLabel(Number(row.value)) : row.value,
          label: definition.id === 'duration' ? durationLabel(Number(row.value)) : row.value,
          count: row.count,
        }))
        .sort((left, right) => {
          if (definition.id === 'duration') {
            return Number.parseInt(left.id, 10) - Number.parseInt(right.id, 10);
          }
          return left.label.localeCompare(right.label);
        }),
    })),
  };
}
