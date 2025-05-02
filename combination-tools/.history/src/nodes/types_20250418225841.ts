import type { Node, BuiltInNode } from '@xyflow/react';
type Obj = {
    name: string,
    key: string,
    text: string,
    type?: string,
    isFold?: boolean,
    isRequired?: boolean,
    value?:{
        name: string,
        type: string,
        input: string,
        urlValueName?: string
    }
}
export type PositionLoggerNode = Node<{ label: string,inputs:Obj[],outputs:Obj[] ,urlLine:string,method:string}, 'position-logger'> ;
export type StartorEndNode = Node<{ label: string ,name:string, inputs?:Obj[],outputs?:Obj[]}, 'start-end'>;

export type AppNode = BuiltInNode | PositionLoggerNode | StartorEndNode;
