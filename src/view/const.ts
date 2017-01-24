export const FontName = {
    MicrosoftYahei: "Microsoft Yahei"
};
export const ViewConst = {
    COMP_WIDTH: 1280,
    COMP_HEIGHT: 720,
    STAGE_WIDTH: 1920,
    STAGE_HEIGHT: 1080
};

export const BaseEvent = {
    CHANGED: 'changed'
};


export const COLOR = {
    PLAYER_EDIT: 'edit player',
};

///   model  events

export const CompInfoEvent = {
    NEW_COMP: "new comp",
    NEW_TRACK: "new track",
    READ_DIR: "read dir",
    DEL_TRACK: "delete track",
    SWAP_TRACK: "swap track",
    UPDATE_CURSOR: "UPDATE_Cursor",
    FRAME_WIDTH_CHANGE: "frame width change"
}

export const TrackInfoEvent = {
    LOADED: "load all imgs",
    SEL_TRACK: "select track",
    PUSH_FRAME: "push frame",
    SEL_FRAME: "select frame",
    DEL_FRAME: "delete frame",
    SET_ACT_TYPE: "set act type",
    SET_OPACITY: "set track opacity",
    SET_ENABLE: "set track enable",
    SET_NAME: "set track name",
    SET_TRACK_START: "SET_TRACK_START",
}
export const FrameTimerEvent = {
    TICK: "TICK"
}
export class TheMachineEvent {
    static UPDATE_IMG: string = "UPDATE_IMG";
    static ADD_IMG: string = "ADD_IMG";
}