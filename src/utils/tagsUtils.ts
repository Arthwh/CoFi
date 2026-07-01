export const formatTagsFromStringToMap = (tags: string) => {
        if (!tags || tags.length === 0 || tags === '') return null
        return tags.split(',').map(t => t.trim())
};

export const formatTagsFromMapToString = (tags: string[] | null) => {
        if (!tags || tags.length === 0 || tags === null) return '';

        return tags.join(', ');
}