# Ayan Song

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Music player with responsive song grid (title, artist, play/pause per card)
- Single audio element for playback; one song at a time; continues while scrolling
- Song upload form (title, artist, MP3/WAV up to 20MB); stored as base64 in localStorage
- Community messages section: post with name, optional DOB, message text
- Each message shows name, age (from DOB), text, like count, comments
- Like and comment functionality (stored in localStorage)
- Admin login (password: ayanbhai07682) using sessionStorage; admin can delete any content
- Logout button visible when admin is logged in
- Sticky mini-player showing currently playing song
- Copy Prompt button that copies prompt text to clipboard
- Premium dark Spotify-like theme with anime aesthetic: glowing accents, glassmorphism, particles/gradient animations
- Fully responsive (mobile, tablet, desktop)

### Modify
N/A

### Remove
N/A

## Implementation Plan
- Minimal Motoko backend (stub)
- All data (songs, messages, likes, comments) stored in localStorage; admin in sessionStorage
- React frontend with all features implemented client-side
- FileReader API for audio upload to base64
- Dynamic UI updates via React state
