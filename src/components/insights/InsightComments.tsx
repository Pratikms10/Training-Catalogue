import React, { useEffect, useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

interface InsightComment {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

interface InsightCommentsProps {
  articleId: string;
}

const storageKey = (articleId: string) => `technoedge-insight-comments:${articleId}`;

const loadComments = (articleId: string): InsightComment[] => {
  try {
    const stored = window.localStorage.getItem(storageKey(articleId));
    return stored ? JSON.parse(stored) as InsightComment[] : [];
  } catch {
    return [];
  }
};

export const InsightComments: React.FC<InsightCommentsProps> = ({ articleId }) => {
  const [comments, setComments] = useState<InsightComment[]>(() => loadComments(articleId));
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    setComments(loadComments(articleId));
    setName('');
    setMessage('');
    setError('');
    setConfirmation('');
  }, [articleId]);

  const submitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanMessage = message.trim();

    if (cleanName.length < 2 || cleanMessage.length < 10) {
      setConfirmation('');
      setError('Please enter your name and a comment of at least 10 characters.');
      return;
    }

    const nextComment: InsightComment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: cleanName,
      message: cleanMessage,
      createdAt: new Date().toISOString(),
    };
    const nextComments = [nextComment, ...comments];

    setComments(nextComments);
    window.localStorage.setItem(storageKey(articleId), JSON.stringify(nextComments));
    setName('');
    setMessage('');
    setError('');
    setConfirmation('Your comment has been added.');
  };

  return (
    <section id="comments" className="insight-comments" aria-labelledby="insight-comments-title">
      <div className="insight-comments__heading">
        <div>
          <p>Join the conversation</p>
          <h2 id="insight-comments-title">Comments</h2>
        </div>
        <span aria-label={`${comments.length} comments`}>
          <MessageSquare aria-hidden="true" /> {comments.length}
        </span>
      </div>

      <form className="insight-comments__form" onSubmit={submitComment} noValidate>
        <div className="insight-comments__field">
          <label htmlFor="insight-comment-name">Name</label>
          <input
            id="insight-comment-name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            maxLength={80}
            placeholder="Your name"
          />
        </div>

        <div className="insight-comments__field">
          <label htmlFor="insight-comment-message">Comment</label>
          <textarea
            id="insight-comment-message"
            name="comment"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={3000}
            rows={5}
            placeholder="Share a useful perspective or question…"
          />
          <span>{message.length}/3000</span>
        </div>

        <div className="insight-comments__form-footer">
          <p>Comments in this prototype are stored only in this browser.</p>
          <button type="submit">
            Post comment <Send aria-hidden="true" />
          </button>
        </div>

        {error && <p className="insight-comments__feedback is-error" role="alert">{error}</p>}
        {confirmation && <p className="insight-comments__feedback is-success" role="status">{confirmation}</p>}
      </form>

      <div className="insight-comments__list" aria-live="polite">
        {comments.length === 0 ? (
          <div className="insight-comments__empty">
            <MessageSquare aria-hidden="true" />
            <h3>Start the conversation</h3>
            <p>Be the first to share a thoughtful perspective on this insight.</p>
          </div>
        ) : comments.map((comment) => (
          <article className="insight-comment" key={comment.id}>
            <div className="insight-comment__avatar" aria-hidden="true">
              {comment.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="insight-comment__meta">
                <h3>{comment.name}</h3>
                <time dateTime={comment.createdAt}>
                  {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(comment.createdAt))}
                </time>
              </div>
              <p>{comment.message}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
