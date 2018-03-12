// ({[type]: resolver, ...}) => (combinedResolver)
// resolver: (getLogsByKeywords) => (meta) => (TLEvents)
// combinedResolver: (getLogsByKeywords) => (rule: {type, meta}) => (TLEvents)
export default (typeToResolverMap) => (getLogsByKeywords) => {
    const typeToGetEventsMap = {}
    for (let type in typeToResolverMap) {
        typeToGetEventsMap[type] = typeToResolverMap[type](getLogsByKeywords)
    }
    return (rule) => {
        if (!typeToResolverMap[rule.type]) {
            throw new Error('Undefined rule type:', rule.type)
        }
        return typeToGetEventsMap[rule.type](rule.meta)
    }
}
