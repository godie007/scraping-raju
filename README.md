# Judicial Branch Scraper Application

This application allows users to query judicial processes using a process code. It displays the results in a user-friendly interface.

## Features

- Query judicial processes using a process code
- Display case details including court, plaintiff, defendant, etc.
- Show a table of all actions related to the case
- Responsive design that works on desktop and mobile devices

## Implementation Notes

This is a frontend implementation that simulates the scraping functionality. In a real-world scenario, you would need to:

1. Set up a Node.js backend server that uses the provided scraping code
2. Create an API endpoint that accepts the process code and returns the scraped data
3. Call this API from the frontend

The `src/server/scraper.js` file contains the original scraping logic that would be used in a Node.js backend.

## How to Use

1. Enter a valid process code in the input field
2. Click "Consultar" to submit the query
3. View the results displayed in the interface

## Development

To run the development server:

```
npm run dev
```

To build for production:

```
npm run build
```
