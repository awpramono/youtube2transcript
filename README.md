# youtube2transcript

Microservice REST API untuk mengambil transcript (subtitle/caption) dari video YouTube berdasarkan URL video.

## Endpoint

### `POST /api/transcript`

Body (JSON):

```json
{
  "url": "https://www.youtube.com/watch?v=dmz--DQty8o",
  "lang": "en"
}
```

- `url` (wajib): URL YouTube (`watch?v=`, `youtu.be/`, `shorts/`, `embed/`) atau video id 11 karakter.
- `lang` (opsional): kode bahasa caption yang diinginkan, mis. `en`, `id`. Jika tidak diisi, dipakai bahasa default video.

Response `200`:

```json
{
  "videoId": "dmz--DQty8o",
  "language": "en",
  "segments": [
    { "text": "...", "offset": 0, "duration": 2.5, "lang": "en" }
  ],
  "fullText": "..."
}
```

### `GET /api/transcript?url=...&lang=...`

Sama seperti di atas tapi via query string, untuk memudahkan tes cepat dari browser/curl.

### `GET /health`

Health check, response `{ "status": "ok" }`.

## Menjalankan secara lokal (butuh Node.js 18+)

```bash
npm install
npm run dev
```

Service jalan di `http://localhost:3000`.

## Menjalankan dengan Docker

```bash
docker compose up --build
```

atau manual:

```bash
docker build -t youtube2transcript .
docker run --rm -p 3000:3000 youtube2transcript
```

## Contoh penggunaan (curl)

```bash
curl -X POST http://localhost:3000/api/transcript \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dmz--DQty8o"}'
```

## Catatan

- Service ini mengambil caption yang memang tersedia untuk video tersebut (baik auto-generated maupun yang diupload pemilik video). Jika video tidak punya caption/transcript, endpoint akan mengembalikan status `422`.
- Untuk video privat/berumur/region-locked, pengambilan transcript bisa gagal karena keterbatasan akses YouTube itu sendiri.
# youtube2transcript
