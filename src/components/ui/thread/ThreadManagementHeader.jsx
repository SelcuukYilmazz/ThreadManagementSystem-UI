import { Card, CardHeader, CardTitle, CardContent } from '../../common/Card';

export const ThreadManagementHeader = ({ error }) => (
    <div>
        <CardHeader>
            <CardTitle>Thread Management System</CardTitle>
        </CardHeader>
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
            </div>
        )}
    </div>
);