import { useState, useRef, useEffect, ChangeEvent } from 'react'
import clsx from 'clsx/lite';

type Props = {
    min: number
    max: number
    step: number
    name: string
    value: number
    disabled: boolean
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    onBlur: (e: ChangeEvent<HTMLInputElement>) => void
    updateNumber: (callback: UpdateNumberCb) => void
}

const TIME = 200 // ms

export default function CustomInputNumber (props: Props) {
    const [input, setInput] = useState(props.value)
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const inputElement = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        setInput(props.value)
    }, [props.value])

    const onBlur = () => {
        if (input > props.max || input < props.min) {
            setInput(props.value)
        } else {
            props.updateNumber(() => Number(input))
        }
    }

    const handleMouseDown = (increment: boolean) => {
        intervalRef.current = setInterval(() => {
            increment
                ? props.updateNumber((prev: number) => {
                    if (prev + props.step <= props.max) return (prev + props.step)
                })
                : props.updateNumber((prev: number) => {
                    if (prev - props.step >= props.min) return (prev - props.step)
                })
        }, TIME);
    };

    const handleMouseUp = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const handleMouseLeave = () => {
        handleMouseUp();
    };

    const triggerInputChange = () => {
        if (inputElement.current) {
            const event = new Event('change', { bubbles: true });
            inputElement.current.dispatchEvent(event);
        };
      };

    const isIncreaseDisabled = props.disabled || props.value === props.max
    const isDecreaseDisabled = props.disabled || props.value === props.min
    

    return (
        <div className='flex gap-x-[8px]'>
            <button
                onClick={() => {
                    props.updateNumber((prev: number) => prev + props.step)
                    triggerInputChange()
                }}
                onMouseDown={() => {
                    handleMouseDown(true)
                }}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                disabled={isIncreaseDisabled}
                className={clsx(
                    "w-[48px] h-[48px] text-[28px] border align-middle box-content",
                    isIncreaseDisabled ? 'border-sky-200 text-sky-200' : 'border-sky-500 text-sky-500'
                )}
            >
                +
            </button>

            <div className="w-[48px] h-[48px] text-[16px] border border-neutral-400 box-content flex items-center justify-center">
                <input
                    ref={inputElement}
                    type="text"
                    inputMode="numeric"
                    value={input}
                    name={props.name}
                    onChange={(e) => {
                        setInput(Number(e.target.value))
                        props.onChange(e)
                    }}
                    onBlur={(e) => {
                        onBlur()
                        props.onBlur(e)
                    }}
                    className="w-[48px] h-[48px] text-center"
                />
            </div>

            <button
                onMouseDown={() => handleMouseDown(false)}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                    props.updateNumber((prev: number) => prev - props.step)
                }}
                disabled={isDecreaseDisabled}
                className={clsx(
                    "w-[48px] h-[48px] text-[28px] border align-middle box-content",
                    isDecreaseDisabled ? 'border-sky-200 text-sky-200' : 'border-sky-500 text-sky-500'
                )}
            >
                -
            </button>
        </div>
    )
}