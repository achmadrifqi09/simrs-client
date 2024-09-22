import {create} from "zustand";

type NavState = {
    show : boolean,
    toggle : () => void

}
const useNavigation = create<NavState>((set) => ({
    show : false,
    toggle : () => set((state) => ({show: !state.show})),
}))

export {useNavigation}