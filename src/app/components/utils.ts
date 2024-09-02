type Props = {
  guest: Guest,
  rooms: Room[]
}


function findCombinations(target: number, parts: number, capacities: Array<number>) {
  if (target < capacities.reduce((acc, cur) => acc + cur), 0) return []

  const results: number[][] = [];

  function recurse(currentCombination:number[], remainingRooms: number, remainingPeople: number) {

      const roomIndex = capacities.length - remainingRooms
      const capacity = capacities[roomIndex]

      if (remainingRooms === 1) {
          if (remainingPeople > capacity) return
          currentCombination.push(remainingPeople);
          results.push([...currentCombination]);
          currentCombination.pop();
          return;
      }

      for (let i = 0; i <= Math.min(remainingPeople, capacity); i++) {
          currentCombination.push(i);
          recurse(currentCombination, remainingRooms - 1, remainingPeople - i);
          currentCombination.pop();
      }
  }

  recurse([], parts, target);
  return results;
}


export function getDefaultRoomAllocation(props: Props): Result[] | null {
  const { rooms, guest: { child, adult } } = props
  const roomCount = rooms.length
  const capacities = rooms.map((room) => room.capacity)

  const childCombinations = findCombinations(child, roomCount, capacities);
  const adultCombinations = findCombinations(adult, roomCount, capacities)
  const validCombinations = childCombinations.flatMap((childCombination) => {
    const validAdultCombination = adultCombinations.filter((combinations) => {
        return combinations.every((adultPerRoom, index) => {
            const childPerRoom = childCombination[index]
            const isFit = (adultPerRoom + childPerRoom) <= rooms[index].capacity
            const isChildWithAdult = !childPerRoom || (childPerRoom && adultPerRoom)
            return isFit && isChildWithAdult
        })
    })
    return validAdultCombination.map((adultCombination) => ({
        adult: adultCombination,
        child: childCombination
        
    }))
  })

  let minPrice = Infinity
  let result = undefined

  validCombinations.forEach((combination) => {
      const res = rooms.map((room, index) => ({
          adult: combination.adult[index],
          child: combination.child[index],
          price: room.roomPrice
              + room.adultPrice * combination.adult[index]
              + room.childPrice * combination.child[index]
      }))

      const totalPrice = res.reduce((acc, val) => acc + val.price, 0)

      if (totalPrice < minPrice) {
          minPrice = totalPrice
          result = res
      }
  })

  return result || null
}
