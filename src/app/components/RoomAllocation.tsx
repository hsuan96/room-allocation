"use client"
import { useState, useMemo } from "react";
import { produce, current as immerCurrent } from 'immer';
import { getDefaultRoomAllocation } from "./utils";
import CustomInputNumber from "./CustomInputNumber";

type Props = {
    guest: Guest
    rooms: Room[]
    onChange: (prop: Result[]) => void
}

type UpdateNumberProp = {
  roomIndex: number,
  target: 'child' | 'adult',
  callback: (prev: any) => number | undefined
}

export default function RoomAllocation(props: Props) {
    const initAllocation = useMemo(
      () => getDefaultRoomAllocation({
        guest: props.guest,
        rooms: props.rooms
      }),
      [props.guest, props.rooms]
    )
    const [current, setCurrent] = useState<Result[] | null>(initAllocation)

    const allocated = current?.reduce((acc, curr) => {
      return { adult: acc.adult + curr.adult, child: acc.child + curr.child }
    }, { adult: 0, child: 0 })

    const unallocated = ({
      adult: props.guest.adult - (allocated?.adult ?? 0),
      child: props.guest.child - (allocated?.child ?? 0)
    })

    const updateNumber = (params: UpdateNumberProp) => {
      const { roomIndex, target, callback } = params

      setCurrent(produce((draft) => {
        if (!draft) return
        const room = props.rooms[roomIndex]
        const newNumber = callback(draft[roomIndex][target])

        if (newNumber !== undefined) {
          draft[roomIndex][target] = newNumber
          draft[roomIndex].price = room.roomPrice
            + room.adultPrice * draft[roomIndex].adult
            + room.childPrice * draft[roomIndex].child
          props.onChange(immerCurrent(draft))
        }
      }))
    }

    return (
      <div className="w-[600px] p-[15px] bg-white border-2 border-dotted">
        <div className="font-bold text-lg mb-[15px]">
            {`住客人數：${props.guest.adult} 位大人，${props.guest.child} 位小孩 / ${props.rooms.length}房`}
        </div>
        <div className="bg-sky-50 p-[10px] mb-[15px]">
            {`尚未分配: ${unallocated.adult} 位大人，${unallocated.child} 位小孩`}
        </div>
        <div>
          {current?.map((res: Result, index: number) => (
            <div key={index}>
              <div className="font-medium">{`房間：${res.adult + res.child} 人`}</div>

              <div className="flex justify-between items-center mb-[10px]">
                <div>
                  大人
                </div>
                <CustomInputNumber
                  min={0}
                  max={Math.min(unallocated.adult + res.adult , props.rooms[index].capacity - res.child)}
                  step={1}
                  value={res.adult}
                  name={`${index}-adult`}
                  disabled={false}
                  onChange={(e) => console.log(e)}
                  onBlur={(e) => console.log(e)}
                  updateNumber={(callback: UpdateNumberCb) => {
                    updateNumber({roomIndex: index, target: "adult", callback})
                  }}
                />
              </div>


              <div className="flex justify-between items-center">
                <div>
                小孩
                </div>
                <CustomInputNumber
                  min={0}
                  max={Math.min(unallocated.child + res.child , props.rooms[index].capacity - res.adult)}
                  step={1}
                  value={res.child}
                  name={`${index}-child`}
                  disabled={false}
                  onChange={(e) => console.log(e)}
                  onBlur={(e) => console.log(e)}
                  updateNumber={(callback: UpdateNumberCb) => {
                    updateNumber({roomIndex: index, target: "child", callback})
                  }}
                />
              </div>


              {props.rooms.length - 1 !== index 
                ? <div className="w-[100%] h-[1px] border-slate-200 border-dotted border my-[10px]" />
                : <div />
              }
            </div>
          ))}
        </div>
      </div>
    );
  }
  