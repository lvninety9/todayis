'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


interface GuestbookEntry {
  id: string;
  author: string;
  message: string;
  created_at: string;
}

export function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch('/api/guestbooks');
      const data = await res.json();
      if (Array.isArray(data)) {
        setEntries(data);
      }
    } catch {
      setError('방명록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!message.trim()) {
      setError('메시지를 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/guestbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: author.trim(), message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '방명록 작성에 실패했습니다.');
        return;
      }

      setEntries((prev) => [data, ...prev]);
      setMessage('');
      setSuccess('작성되었습니다!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('서버 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900">
          축하 메세지
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 작성 폼 */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="이름"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={20}
            className="text-center"
          />
          <textarea
            placeholder="축하 메세지를 남겨주세요"
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            maxLength={200}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{message.length}/200</span>
            <Button type="submit" disabled={submitting} className="px-6">
              {submitting ? '작성 중...' : '작성하기'}
            </Button>
          </div>
        </form>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-500 text-center">{success}</p>
        )}

        {/* 방명록 목록 */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {loading ? (
            <p className="text-center text-gray-400 py-4">로딩 중...</p>
          ) : entries.length === 0 ? (
            <p className="text-center text-gray-400 py-4">
              아직 메세지가 없습니다. 첫 번째 축하 메세지를 남겨주세요!
            </p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-700">
                    {entry.author}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTime(entry.created_at)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {entry.message}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default Guestbook;
