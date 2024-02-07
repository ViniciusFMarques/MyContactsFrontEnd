class CategoryMapper{
  toDomain(persistenceCategory){
    return{
      id: persistenceCategory.id,
      name: persistenceCategory.name
    }
  }
}


// eslint-disable-next-line
export default new CategoryMapper;
