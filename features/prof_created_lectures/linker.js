const linker = list => {
  if (list === undefined) return list
  return list.map(item => ({
    time_created: item.time_created,
    code: item.schedule_id,
    location: 'fixed now',
  }))
}

export default linker
