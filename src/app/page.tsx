"use client"
import './globals.css'
import RoomAllocation from "./components/RoomAllocation";

const guest: Guest = { adult: 4, child: 2 }
const rooms: Room[] = [
  { roomPrice: 1000, adultPrice: 200, childPrice: 100, capacity: 4 },
  { roomPrice: 0, adultPrice: 500, childPrice: 500, capacity: 4 },
  { roomPrice: 500, adultPrice: 300, childPrice: 200, capacity: 4 },
]

export default function Home() {

  return (
    <div className='flex justify-center py-[50px]'>
      <RoomAllocation
        guest={guest}
        rooms={rooms}
        onChange={result => console.log(result)}
      />
    </div>
  );
}
