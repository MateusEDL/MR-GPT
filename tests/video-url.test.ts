import assert from 'node:assert/strict';
import test from 'node:test';
import { videoEmbed } from '../src/lib/video';

test('YouTube embeds use the privacy-enhanced origin and a validated video ID', () => {
  for (const url of [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtube.com/watch?v=dQw4w9WgXcQ&t=30',
    'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtu.be/dQw4w9WgXcQ/',
    'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    'https://www.youtube.com/live/dQw4w9WgXcQ',
    'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
    'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  ]) assert.deepEqual(videoEmbed(url), { provider: 'YouTube', src: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0' });
});

test('Vimeo embeds validate numeric IDs and request Do Not Track', () => {
  for (const url of ['https://vimeo.com/123456789', 'https://www.vimeo.com/123456789/', 'https://player.vimeo.com/video/123456789?autoplay=1']) {
    assert.deepEqual(videoEmbed(url), { provider: 'Vimeo', src: 'https://player.vimeo.com/video/123456789?dnt=1' });
  }
});

test('Embed URLs reject arbitrary providers, spoofed hosts, unsafe schemes and credentials', () => {
  for (const url of [
    'https://example.com/video/dQw4w9WgXcQ',
    'https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ',
    'https://notyoutube.com/watch?v=dQw4w9WgXcQ',
    'https://vimeo.com.evil.example/123456789',
    'https://evil-youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com@evil.example/watch?v=dQw4w9WgXcQ',
    'https://name:secret@www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://name@vimeo.com/123456789',
    'https://www.youtube.com:8443/watch?v=dQw4w9WgXcQ',
    'http://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'http://vimeo.com/123456789',
    'javascript:alert(1)',
    'data:text/html,video',
    '//www.youtube.com/watch?v=dQw4w9WgXcQ',
    '/video/dQw4w9WgXcQ',
    'not a URL',
    '',
  ]) assert.equal(videoEmbed(url), null, url);
});

test('Malformed paths and invalid IDs cannot become embedded content', () => {
  for (const url of [
    'https://www.youtube.com/watch?v=short',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQx',
    'https://www.youtube.com/watch?v=dQw4w9WgXc!',
    'https://www.youtube.com/embed/dQw4w9WgXcQ/other',
    'https://www.youtube.com/redirect?url=https://evil.example',
    'https://youtu.be//dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ/other',
    'https://youtu.be/dQw4w9WgXcQ%2Fother',
    'https://www.youtube.com\\@evil.example/watch?v=dQw4w9WgXcQ',
    'https://vimeo.com/12345abc',
    'https://vimeo.com/1234567890123456',
    'https://vimeo.com/channels/123456789',
    'https://player.vimeo.com/video/12345/other',
  ]) assert.equal(videoEmbed(url), null, url);
});
