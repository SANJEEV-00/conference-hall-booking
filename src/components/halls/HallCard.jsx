import { Link } from 'react-router-dom'


export function HallCard({ hall, variant = 'default', showBookButton = true, onImageClick }) {
  const hasImage = hall?.image
  const name = hall?.name ?? 'Hall'
  const capacity = hall?.capacity ?? 0
  const description = hall?.description ?? ''

  const isCompact = variant === 'compact'
  const isFeatured = variant === 'featured'

  const cardClass = [
    'glass overflow-hidden transition-all duration-300',
    isFeatured && 'ring-2 ring-blue-900/50 dark:ring-blue-500/50 shadow-lg',
    !isCompact && 'hover:shadow-xl hover:-translate-y-0.5',
  ].filter(Boolean).join(' ')

  const imageWrapClass = isCompact ? 'h-24' : isFeatured ? 'h-56' : 'h-44'
  const aspectClass = 'aspect-[16/10]'

  return (
    <div className={cardClass}>
      <div
        className={`${imageWrapClass} w-full overflow-hidden bg-slate-200 dark:bg-slate-700 relative cursor-pointer group`}
        onClick={() => onImageClick?.(hall)}
        role={onImageClick ? 'button' : undefined}
        tabIndex={onImageClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (onImageClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onImageClick(hall)
          }
        }}
      >
        {hasImage ? (
          <>
            <img
              src={hall.image}
              alt={name}
              className={`w-full h-full object-cover ${!isCompact ? 'group-hover:scale-105 transition-transform duration-300' : ''}`}
            />
            {onImageClick && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 text-white font-medium text-sm transition-opacity">
                  Click to book
                </span>
              </div>
            )}
          </>
        ) : (
          <div
            className={`w-full h-full ${aspectClass} bg-gradient-to-br from-white via-slate-50 to-slate-200 flex items-center justify-center text-slate-700 text-4xl font-light`}
            aria-hidden
          >
            {name.charAt(0)}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className={`font-semibold text-slate-800 dark:text-slate-100 ${isFeatured ? 'text-lg' : ''}`}>
          {name}
        </h3>
        <p className="text-sm text-blue-900 dark:text-blue-400 mt-0.5">Capacity: {capacity}</p>
        {description && !isCompact && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{description}</p>
        )}
        {showBookButton && (
          <Link
            to="/user"
            className="mt-3 inline-block px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 text-white text-sm font-medium transition"
          >
            Book now
          </Link>
        )}
      </div>
    </div>
  )
}
