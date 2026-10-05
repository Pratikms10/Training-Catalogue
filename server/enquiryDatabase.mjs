/** Durable lead capture. The CRM outbox entry commits with the enquiry. */
export async function saveEnquiryToDatabase(pool, enquiry) {
  const client = await pool.connect();
  const reference = `TE-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${enquiry.submissionId.slice(0, 8).toUpperCase()}`;
  try {
    await client.query('BEGIN');
    const inserted = await client.query(`
      INSERT INTO leads.enquiries (
        submission_id, reference, kind, name, email, phone, company, service,
        course_id, course_title, course_category, learners, delivery, notes,
        preferred_channel, trainer_expertise, trainer_experience, profile_url,
        source_page, cta_id
      ) VALUES (
        $1::uuid, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20
      )
      ON CONFLICT (submission_id) DO NOTHING
      RETURNING reference
    `, [
      enquiry.submissionId, reference, enquiry.kind, enquiry.name, enquiry.email,
      enquiry.phone, enquiry.company, enquiry.service, enquiry.courseId,
      enquiry.courseTitle, enquiry.courseCategory, enquiry.learners,
      enquiry.delivery, enquiry.notes, enquiry.preferredChannel,
      enquiry.trainerExpertise, enquiry.trainerExperience, enquiry.profileUrl,
      enquiry.sourcePage, enquiry.ctaId,
    ].map((value) => value ?? ''));

    let savedReference = inserted.rows[0]?.reference;
    if (!savedReference) {
      const existing = await client.query(
        'SELECT reference FROM leads.enquiries WHERE submission_id = $1::uuid',
        [enquiry.submissionId],
      );
      if (!existing.rows[0]) throw new Error('The enquiry could not be found after a duplicate submission.');
      savedReference = existing.rows[0].reference;
    }

    await client.query(`
      INSERT INTO leads.crm_outbox (submission_id, destination)
      VALUES ($1::uuid, 'internal_crm')
      ON CONFLICT (submission_id, destination) DO NOTHING
    `, [enquiry.submissionId]);
    await client.query('COMMIT');
    return { reference: savedReference, duplicate: inserted.rowCount === 0 };
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}
