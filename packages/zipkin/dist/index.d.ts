export interface InfoOnlineProps {
    title: string;
    tag: Record<string, any>;
    DFTracer?: any;
    localServiceName?: string | undefined;
}
export declare function setInfoOnline(props: InfoOnlineProps): void;
