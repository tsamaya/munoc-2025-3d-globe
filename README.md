# munoc-2025 globe

## Prerequisites

- node 22
- pnpm

## Getting started

Clone the repo then install the dependencies

```bash
pnpm install
```

## Developing

Start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Testing

To test the the web application using e2e tests:

```bash
# requires
pnpm exec playwright install

pnpm run test:e2e
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `npm run preview`.
