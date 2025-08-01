import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class MondayParser implements INodeType {
    description: INodeTypeDescription;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
    static parseColumnValue(cvValue: any, cvType: string): any;
    static getMappableValue(cv: any, parsedValue: any): any;
    static transformMondayData(item: any, boardId: string, groupTitle: string, emailPattern?: string): any;
}
