"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MondayParser = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class MondayParser {
    constructor() {
        this.description = {
            displayName: 'Monday Parser',
            name: 'mondayParser',
            icon: 'file:mondayparser.svg',
            group: ['transform'],
            version: 1,
            description: 'Parse and structure Monday.com data with advanced column type handling',
            defaults: {
                name: 'Monday Parser',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Transform Data',
                            value: 'transform',
                            description: 'Parse and structure Monday.com data',
                            action: 'Transform Monday.com data',
                        },
                    ],
                    default: 'transform',
                },
                {
                    displayName: 'Input JSON',
                    name: 'inputJson',
                    type: 'json',
                    default: '{}',
                    description: 'Monday.com data to be transformed (JSON format)',
                    displayOptions: {
                        show: {
                            operation: ['transform'],
                        },
                    },
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const operation = this.getNodeParameter('operation', 0);
        if (operation === 'transform') {
            const returnData = [];
            for (let i = 0; i < items.length; i++) {
                try {
                    // Get JSON input from parameter
                    let inputData;
                    try {
                        const jsonInput = this.getNodeParameter('inputJson', i);
                        inputData = typeof jsonInput === 'string' ? JSON.parse(jsonInput) : jsonInput;
                    }
                    catch (jsonError) {
                        // Fallback to incoming data if JSON parsing fails
                        inputData = items[i].json;
                    }
                    const transformedData = MondayParser.transformMondayData(inputData);
                    returnData.push({ json: transformedData });
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({
                            json: {},
                            error: new n8n_workflow_1.NodeOperationError(this.getNode(), error, { itemIndex: i }),
                        });
                        continue;
                    }
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {
                        itemIndex: i,
                    });
                }
            }
            return [returnData];
        }
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
    }
    static parseColumnValue(cvValue, cvType) {
        if (!cvValue) {
            return null;
        }
        try {
            let valueData;
            // Try to parse JSON if it's a string
            if (typeof cvValue === 'string') {
                try {
                    valueData = JSON.parse(cvValue);
                }
                catch {
                    // If not JSON, return as is for simple types
                    return cvValue;
                }
            }
            else {
                valueData = cvValue;
            }
            // Processing by column types
            switch (cvType) {
                case 'creation_log':
                    return {
                        created_at: valueData === null || valueData === void 0 ? void 0 : valueData.created_at,
                        creator_id: valueData === null || valueData === void 0 ? void 0 : valueData.creator_id,
                    };
                case 'status':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            label: valueData.label,
                            index: valueData.index,
                            post_id: valueData.post_id,
                            changed_at: valueData.changed_at,
                        };
                    }
                    return valueData;
                case 'checkbox':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            checked: valueData.checked === 'true' || valueData.checked === true,
                            changed_at: valueData.changed_at,
                        };
                    }
                    return null;
                case 'long_text':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            text: valueData.text || '',
                            changed_at: valueData.changed_at || '',
                        };
                    }
                    return { text: String(valueData) };
                case 'link':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            url: valueData.url,
                            text: valueData.text,
                            changed_at: valueData.changed_at,
                        };
                    }
                    return null;
                case 'date':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            date: valueData.date,
                            time: valueData.time,
                            changed_at: valueData.changed_at,
                        };
                    }
                    return null;
                case 'timeline':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            from: valueData.from,
                            to: valueData.to,
                            changed_at: valueData.changed_at,
                            visualization_type: valueData.visualization_type,
                        };
                    }
                    return null;
                case 'people':
                    if (typeof valueData === 'object' && valueData !== null) {
                        const personsTeams = valueData.personsAndTeams || [];
                        return {
                            personsAndTeams: personsTeams,
                            changed_at: valueData.changed_at,
                            persons_count: personsTeams.filter((p) => p.kind === 'person').length,
                            teams_count: personsTeams.filter((p) => p.kind === 'team').length,
                        };
                    }
                    return null;
                case 'dropdown':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            ids: valueData.ids || [],
                            changed_at: valueData.changed_at,
                        };
                    }
                    return null;
                case 'tags':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            tag_ids: valueData.tag_ids || [],
                            changed_at: valueData.changed_at,
                        };
                    }
                    return null;
                case 'email':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            email: valueData.email,
                            text: valueData.text || valueData.email,
                            changed_at: valueData.changed_at,
                        };
                    }
                    return { email: String(valueData), text: String(valueData) };
                case 'phone':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            phone: valueData.phone,
                            countryShortName: valueData.countryShortName,
                            changed_at: valueData.changed_at,
                        };
                    }
                    return { phone: String(valueData) };
                case 'file':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            files: valueData.files || [],
                            changed_at: valueData.changed_at,
                        };
                    }
                    return null;
                case 'board_relation':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            linkedPulseIds: valueData.linkedPulseIds || [],
                            changed_at: valueData.changed_at,
                        };
                    }
                    return null;
                case 'dependency':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            linkedPulseIds: valueData.linkedPulseIds || [],
                            changed_at: valueData.changed_at,
                        };
                    }
                    return null;
                case 'mirror':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            linkedPulseId: valueData.linkedPulseId,
                            linkedPulseColumnId: valueData.linkedPulseColumnId,
                        };
                    }
                    return null;
                case 'location':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            address: valueData.address,
                            lat: valueData.lat,
                            lng: valueData.lng,
                            changed_at: valueData.changed_at,
                        };
                    }
                    return null;
                case 'country':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            countryCode: valueData.countryCode,
                            countryName: valueData.countryName,
                            changed_at: valueData.changed_at,
                        };
                    }
                    return null;
                case 'rating':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            rating: valueData.rating,
                            changed_at: valueData.changed_at,
                        };
                    }
                    return null;
                case 'vote':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            votes: valueData.votes || [],
                            voters: valueData.voters || [],
                            changed_at: valueData.changed_at,
                        };
                    }
                    return null;
                case 'hour':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            hour: valueData.hour,
                            minute: valueData.minute,
                            changed_at: valueData.changed_at,
                        };
                    }
                    return null;
                case 'week':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            week: valueData.week,
                            startDate: valueData.startDate,
                            endDate: valueData.endDate,
                            changed_at: valueData.changed_at,
                        };
                    }
                    return null;
                case 'world_clock':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            timezone: valueData.timezone,
                            changed_at: valueData.changed_at,
                        };
                    }
                    return null;
                case 'time_tracking':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            duration: valueData.duration,
                            startDate: valueData.startDate,
                            status: valueData.status,
                            changed_at: valueData.changed_at,
                        };
                    }
                    return null;
                case 'formula':
                    return valueData;
                case 'button':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            label: valueData.label,
                            color: valueData.color,
                            url: valueData.url,
                        };
                    }
                    return null;
                case 'last_updated':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            updatedAt: valueData.updatedAt,
                            updater: valueData.updater,
                        };
                    }
                    return null;
                case 'item_id':
                    return valueData;
                case 'doc':
                    if (typeof valueData === 'object' && valueData !== null) {
                        return {
                            file_id: valueData.file_id,
                            changed_at: valueData.changed_at,
                        };
                    }
                    return null;
                case 'text':
                case 'numbers':
                    return valueData;
                default:
                    // Special handling for color column
                    if (cvType === 'color' || (cvType && cvType.includes('color'))) {
                        if (typeof valueData === 'object' && valueData !== null) {
                            return {
                                index: valueData.index,
                                post_id: valueData.post_id,
                                changed_at: valueData.changed_at || '',
                                label: valueData.label,
                                color: valueData.color || '#00c875',
                            };
                        }
                        return null;
                    }
                    return valueData;
            }
        }
        catch (error) {
            console.error(`Error parsing column value of type ${cvType}:`, error);
            return null;
        }
    }
    static getMappableValue(cv, parsedValue) {
        const cvType = cv === null || cv === void 0 ? void 0 : cv.type;
        const cvText = cv === null || cv === void 0 ? void 0 : cv.text;
        if (parsedValue === null) {
            return null;
        }
        // For simple types return text representation
        if (['text', 'numbers', 'formula', 'item_id'].includes(cvType)) {
            return cvText || parsedValue;
        }
        // For status return text (label)
        if (cvType === 'status') {
            return cvText;
        }
        // For checkbox return structure with checked and text
        if (cvType === 'checkbox') {
            if (typeof parsedValue === 'object' && parsedValue !== null) {
                return {
                    checked: parsedValue.checked || false,
                    text: cvText,
                };
            }
            return null;
        }
        // For other types return full structure with text field
        if (typeof parsedValue === 'object' && parsedValue !== null) {
            // Add text field if it doesn't exist
            if (!parsedValue.text && cvText) {
                parsedValue.text = cvText;
            }
            return parsedValue;
        }
        return parsedValue;
    }
    static transformMondayData(item) {
        var _a, _b, _c;
        const defaultBoardId = '1234567890';
        const defaultGroupTitle = 'Parsed Items';
        const defaultEmailPattern = 'item_{id}@monday.com';
        const transformed = {
            id: item.id,
            name: item.name,
            created_at: item.created_at,
            state: item.state,
            email: defaultEmailPattern.replace('{id}', item.id || 'unknown'),
            updated_at: new Date().toISOString(),
            board: { id: ((_a = item.board) === null || _a === void 0 ? void 0 : _a.id) || defaultBoardId },
            group: {
                id: ((_b = item.group) === null || _b === void 0 ? void 0 : _b.id) || 'topics',
                title: ((_c = item.group) === null || _c === void 0 ? void 0 : _c.title) || defaultGroupTitle,
                deleted: false,
                archived: false,
            },
            assets: [],
            parent_item: null,
            subitems: [],
            creator_id: null,
            column_values: [],
            mappable_column_values: {},
        };
        // Get column_values
        const columnValues = item.column_values || [];
        // Find creator_id from creation_log
        const creationLog = columnValues.find((cv) => cv.type === 'creation_log');
        if (creationLog && creationLog.value) {
            const parsedCreation = MondayParser.parseColumnValue(creationLog.value, 'creation_log');
            if (parsedCreation) {
                transformed.creator_id = parsedCreation.creator_id;
            }
        }
        // Process column_values
        const transformedColumnValues = [];
        const mappableColumnValues = {};
        for (const cv of columnValues) {
            const cvId = cv.id;
            const cvValue = cv.value;
            const cvText = cv.text;
            const cvType = cv.type;
            const cvColumn = cv.column || {};
            const cvTitle = cvColumn.title || '';
            // Basic structure for transformed_column_values
            const newCv = {
                id: cvId,
                value: cvValue,
                text: cvText,
                title: cvTitle,
                additional_info: undefined,
            };
            // Parse column value
            const parsedValue = MondayParser.parseColumnValue(cvValue, cvType);
            // Add additional_info for certain types
            if (cvType === 'status' && parsedValue && typeof parsedValue === 'object') {
                const additionalInfo = {
                    label: cvText || parsedValue.label,
                    color: '#00c875',
                    changed_at: parsedValue.changed_at || '',
                };
                newCv.additional_info = JSON.stringify(additionalInfo);
            }
            else if (cvType === 'numbers') {
                // Try to get unit from settings
                try {
                    const settings = JSON.parse(cvColumn.settings_str || '{}');
                    if (settings.unit) {
                        newCv.additional_info = JSON.stringify(settings.unit);
                    }
                }
                catch {
                    // Ignore parsing errors
                }
            }
            else if (cvId.startsWith('color_') && parsedValue && typeof parsedValue === 'object') {
                // Special handling for color columns
                const additionalInfo = {
                    label: cvText || parsedValue.label,
                    color: parsedValue.color || '#00c875',
                    changed_at: parsedValue.changed_at || '',
                };
                newCv.additional_info = JSON.stringify(additionalInfo);
            }
            transformedColumnValues.push(newCv);
            // Create mappable_column_values
            const mappableValue = MondayParser.getMappableValue(cv, parsedValue);
            mappableColumnValues[cvId] = mappableValue;
        }
        transformed.column_values = transformedColumnValues;
        transformed.mappable_column_values = mappableColumnValues;
        return transformed;
    }
}
exports.MondayParser = MondayParser;
