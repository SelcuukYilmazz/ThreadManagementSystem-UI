export function Card({ className, ...props }) {
    return (
        <div
            className={`bg-white rounded-lg border shadow-sm ${className}`}
            {...props}
        />
    )
}

export function CardHeader({ className, ...props }) {
    return <div className={`p-6 pb-4 ${className}`} {...props} />
}

export function CardTitle({ className, ...props }) {
    return (
        <h3
            className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
            {...props}
        />
    )
}

export function CardContent({ className, ...props }) {
    return <div className={`p-6 pt-0 ${className}`} {...props} />
}