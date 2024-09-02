type Guest = {
    adult: number,
    child: number
}

type Room = {
    roomPrice: number,
    adultPrice: number,
    childPrice: number,
    capacity: number
}

type Result = {
    adult: number,
    child: number,
    price: number
}

type UpdateNumberCb = (prev: number) => number | undefined