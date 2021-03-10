import { createStore, combineReducers } from "redux";

import sidebarReducer from "./Reducers/sidebarReducer";
import mobileSidebarReducer from "./Reducers/mobileSidebarReducer";
import profileSidebarReducer from "./Reducers/profileSidebarReducer";
import mobileProfileSidebarReducer from "./Reducers/mobileProfileSidebarReducer";
import userProfileSidebarReducer from "./Reducers/userProfileSidebarReducer";
import mobileUserProfileSidebarReducer from "./Reducers/mobileUserProfileSidebarReducer";
import groupProfileReducer from "./Reducers/groupProfileReducer";
import pageTourReducer from "./Reducers/pageTourReducer";

const reducers = combineReducers({
  selectedSidebar: sidebarReducer,
  mobileSidebar: mobileSidebarReducer,
  profileSidebar: profileSidebarReducer,
  mobileProfileSidebar: mobileProfileSidebarReducer,
  userProfileSidebar: userProfileSidebarReducer,
  mobileUserProfileSidebar: mobileUserProfileSidebarReducer,
  groupProfileSidebar : groupProfileReducer,
  pageTour: pageTourReducer,
});

const store = createStore(reducers);

export default store;
