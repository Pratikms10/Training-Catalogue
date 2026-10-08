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

export const InsightComments: React.FC<InsightCommentsProps> = ({ articleId }) => {
  const [comments, setComments] = useState<InsightComment[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    let active = true;
    fetch(`/api/insights/${encodeURIComponent(articleId)}/comments`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Comments could not be loaded.');
        return response.json() as Promise<{ data: InsightComment[] }>;
      })
      .then((result) => { if (active) setComments(result.data || []); })
      .catch(() => { if (active) setComments([]); });
    setName('');
    setEmail('');
    setMessage('');
    setError('');
    setConfirmation('');
    return () => { active = false; };
  }, [articleId]);

  const submitComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    if (cleanName.length < 2 || !cleanEmail || cleanMessage.length < 10) {
      setConfirmation('');
      setError('Please enter your name, email, and a comment of at least 10 characters.');
      return;
    }
    try {
      const response = await fetch(`/api/insights/${encodeURIComponent(articleId)}/comments`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, email: cleanEmail, message: cleanMessage }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Your comment could not be submitted.');
      setName(''); setEmail(''); setMessage(''); setError('');
      setConfirmation('Thanks. Your comment is awaiting approval before it appears publicly.');
    } catch (submissionError) {
      setConfirmation('');
      setError(submissionError instanceof Error ? submissionError.message : 'Your comment could not be submitted.');
    }
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
          <label htmlFor="insight-comment-email">Email <span>(private)</span></label>
          <input
            id="insight-comment-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            maxLength={254}
            placeholder="you@company.com"
          />
        </div>

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
          <p>Your email stays private. Approved comments are published publicly.</p>
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
