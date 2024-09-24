import {create} from "zustand";

type NavState = {
    show : boolean ,
    toggle : () => void

}
const useNavigation = create<NavState>((set) => ({
    show : true,
    toggle : () => set((state) => ({show: !state.show})),
}))

export {useNavigation}