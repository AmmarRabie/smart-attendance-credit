export const fetchLectures = async () => {
  await sleep(3000)
  return new Promise(resolve =>
    resolve({
      lectures: [
        {id: 1, day: 'saturday', dateCreated: '15/8/2000', schedule: 'MTHN001'},
        {id: 2, day: 'monday', dateCreated: '4/8/2000', schedule: 'MTHN001'},
        {id: 3, day: 'thursday', dateCreated: '2/5/2000', schedule: 'MTHN001'},
        {id: 4, day: 'tuesday', dateCreated: '20/7/2000', schedule: 'MTHN001'},
      ],
    })
  )
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default fetchLectures
