/**
 * Central error handler + 404 fallback.
 */
export function notFound(_req, res) {
  res.status(404).json({ message: 'Not found.' })
}

// Express needs the 4-arg signature to recognise this as error middleware.
export function errorHandler(err, _req, res, _next) {
  // Mongoose validation / cast errors → 400; everything else → 500.
  const status = err.name === 'ValidationError' || err.name === 'CastError' ? 400 : err.status || 500
  if (status >= 500) console.error(err)
  res.status(status).json({ message: err.message || 'Something went wrong.' })
}
