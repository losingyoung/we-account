import { combineReducers } from "redux";
import groupPreference from './reducers/groupPreference'
import userInfo from './reducers/userInfo'
import groupInfo from './reducers/groupInfo'
import accountItems from "./reducers/accountItems/index.js";
// function counter(state = 0, {type, namespace}) {
//     switch (type) {
//         case "ADD":
//            return state+=1
//         case "REDUCE":
//            return state-=1
//         default:
//            return state
//     }
// }
// function aReducer(state = 0, {namespace, type, data}) {
//     switch (type) {
//         case "MUL":
//            return state *= 10
//             break;
//         default:
//         return state
//             break;
//     }
// }
// function bReducer(state = 0, {namespace, type, data}) {
//     switch (type) {
//         case "MINUS":
//             return state = -state
//             break;
//         default:
//         return state
//             break;
//     }
// }
// function withNameSpaceCounter(NAMESPACE, commonReducer) {
//     return function reducer(state, action) {
//         if (action.namespace !== NAMESPACE && state!==undefined) {
//             return state
//         }
//         return commonReducer(state, action)
//     }
// }
// function composeReducers(...reducers){
//     return function reducer(state, action) {
//         if (reducers.length === 0){
//             return state
//         }
//         let last = reducers[reducers.length - 1]
//         return reducers.slice(0, -1).reduceRight((sum, cur) => {
//             return cur(sum, action)
//         }, last(state, action))
//     }
    
// }
export default combineReducers({
    groupPreference,
    userInfo,
    groupInfo,
    accountItems,
    // counterA: composeReducers(aReducer, withNameSpaceCounter("aaa", counter)),
    // counterB: composeReducers(bReducer, withNameSpaceCounter("bbb", counter))
})
