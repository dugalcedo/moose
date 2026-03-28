export type MooseFetchOptions = {
    immediate?: boolean
    poll?: number  // polling interval in ms; omit or 0 to disable
}

export type MooseFormNumberControls = (node: HTMLElement, options: {
    changeBy: number
    step?: number
    min?: number
    max?: number
}) => void