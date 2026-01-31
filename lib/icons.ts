import * as Icons from 'lucide-react';

export const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.Wrench;
    return Icon;
};
