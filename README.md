# Brothers Cyber Lounge frontend

The public website is a static HTML/CSS/JavaScript site. The admin panel is available at `admin.html` and edits the content served by the Brothers REST API.

## Run locally

1. Make sure the production API at `https://brothers-backend-production.up.railway.app` is available.
2. Serve this directory over HTTP (for example, with the VS Code Live Server extension).
3. Set `CORS_ALLOWED_ORIGINS` in the API process to the exact frontend origin, such as `http://127.0.0.1:5500` (or `http://localhost:5500` if that is what the browser shows).
4. Open the public site at the static server address. The site and `/admin.html` use the fixed API address configured in `js/runtime-config.js`.

The admin token session is kept in the current browser tab. Configure the backend CORS origin to the website's exact origin.

The panel manages zones, contact/location data, and the booking time step. The public website fetches those values from the API on page load. If the API cannot be reached, the public page displays the bundled defaults from `js/data.js` and shows a warning. Booking records are not included because the backend does not yet expose booking-management endpoints.
