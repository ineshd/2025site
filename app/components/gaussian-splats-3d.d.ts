declare module "@mkkellogg/gaussian-splats-3d" {
    import * as THREE from "three";

    export class DropInViewer extends THREE.Group {
        constructor(options?: Record<string, unknown>);
        viewer: { dispose: () => Promise<void> };
        addSplatScene(path: string, options?: Record<string, unknown>): Promise<void>;
    }
}
