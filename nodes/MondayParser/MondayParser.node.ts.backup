import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

export class MondayParser implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Monday Parser',
		name: 'mondayParser',
		icon: 'file:mondayparser.svg',
		group: ['transform'],
		version: 1,
		description: 'Парсер данных Monday.com для структурирования колонок',
		defaults: {
			name: 'Monday Parser',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Операция',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Трансформировать данные',
						value: 'transform',
						description: 'Парсит и структурирует данные Monday.com',
						action: 'Трансформировать данные Monday.com',
					},
				],
				default: 'transform',
			},
			{
				displayName: 'Board ID',
				name: 'boardId',
				type: 'string',
				default: '7992652551',
				description: 'ID доски Monday.com',
				displayOptions: {
					show: {
						operation: ['transform'],
					},
				},
			},
			{
				displayName: 'Group Title',
				name: 'groupTitle',
				type: 'string',
				default: 'Detected results',
				description: 'Название группы для обработанных элементов',
				displayOptions: {
					show: {
						operation: ['transform'],
					},
				},
			},
			{
				displayName: 'Email Pattern',
				name: 'emailPattern',
				type: 'string',
				default: 'pulse_{id}@monday.com',
				description: 'Шаблон email, {id} будет заменен на ID элемента',
				displayOptions: {
					show: {
						operation: ['transform'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const operation = this.getNodeParameter('operation', 0) as string;
		const boardId = this.getNodeParameter('boardId', 0) as string;
		const groupTitle = this.getNodeParameter('groupTitle', 0) as string;
		const emailPattern = this.getNodeParameter('emailPattern', 0) as string;

		if (operation === 'transform') {
			const returnData: INodeExecutionData[] = [];

			for (let i = 0; i < items.length; i++) {
				try {
					const item = items[i].json;
					const transformedData = MondayParser.transformMondayData(item, boardId, groupTitle, emailPattern);
					returnData.push({ json: transformedData });
				} catch (error) {
					if (this.continueOnFail()) {
						returnData.push({
							json: {},
							error: new NodeOperationError(this.getNode(), error as Error, { itemIndex: i }),
						});
						continue;
					}
					throw new NodeOperationError(this.getNode(), error as Error, {
						itemIndex: i,
					});
				}
			}

			return [returnData];
		}

		throw new NodeOperationError(this.getNode(), `Неподдерживаемая операция: ${operation}`);
	}

	public static parseColumnValue(cvValue: any, cvType: string): any {
		if (!cvValue) {
			return null;
		}

		try {
			let valueData: any;

			// Попробуем распарсить JSON, если это строка
			if (typeof cvValue === 'string') {
				try {
					valueData = JSON.parse(cvValue);
				} catch {
					// Если не JSON, вернем как есть для простых типов
					return cvValue;
				}
			} else {
				valueData = cvValue;
			}

			// Обработка по типам колонок
			switch (cvType) {
				case 'creation_log':
					return {
						created_at: valueData?.created_at,
						creator_id: valueData?.creator_id,
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
							persons_count: personsTeams.filter((p: any) => p.kind === 'person').length,
							teams_count: personsTeams.filter((p: any) => p.kind === 'team').length,
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
					// Специальная обработка для color колонки
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
		} catch (error) {
			console.error(`Error parsing column value of type ${cvType}:`, error);
			return null;
		}
	}

	public static getMappableValue(cv: any, parsedValue: any): any {
		const cvType = cv?.type;
		const cvText = cv?.text;

		if (parsedValue === null) {
			return null;
		}

		// Для простых типов возвращаем текстовое представление
		if (['text', 'numbers', 'formula', 'item_id'].includes(cvType)) {
			return cvText || parsedValue;
		}

		// Для status возвращаем текст (label)
		if (cvType === 'status') {
			return cvText;
		}

		// Для checkbox возвращаем структуру с checked и text
		if (cvType === 'checkbox') {
			if (typeof parsedValue === 'object' && parsedValue !== null) {
				return {
					checked: parsedValue.checked || false,
					text: cvText,
				};
			}
			return null;
		}

		// Для остальных типов возвращаем полную структуру с text полем
		if (typeof parsedValue === 'object' && parsedValue !== null) {
			// Добавляем text поле если его нет
			if (!parsedValue.text && cvText) {
				parsedValue.text = cvText;
			}
			return parsedValue;
		}
		return parsedValue;
	}

	public static transformMondayData(item: any, boardId: string, groupTitle: string, emailPattern: string = 'pulse_{id}@monday.com'): any {
		const transformed = {
			id: item.id,
			name: item.name,
			created_at: item.created_at,
			state: item.state,
			email: emailPattern.replace('{id}', item.id),
			updated_at: new Date().toISOString(),
			board: { id: boardId },
			group: {
				id: 'topics',
				title: groupTitle,
				deleted: false,
				archived: false,
			},
			assets: [],
			parent_item: null,
			subitems: [],
			creator_id: null as string | null,
			column_values: [] as any[],
			mappable_column_values: {} as any,
		};

		// Получаем column_values
		const columnValues = item.column_values || [];

		// Ищем creator_id из creation_log
		const creationLog = columnValues.find((cv: any) => cv.type === 'creation_log');
		if (creationLog && creationLog.value) {
			const parsedCreation = MondayParser.parseColumnValue(creationLog.value, 'creation_log');
			if (parsedCreation) {
				transformed.creator_id = parsedCreation.creator_id;
			}
		}

		// Обрабатываем column_values
		const transformedColumnValues: any[] = [];
		const mappableColumnValues: any = {};

		for (const cv of columnValues) {
			const cvId = cv.id;
			const cvValue = cv.value;
			const cvText = cv.text;
			const cvType = cv.type;
			const cvColumn = cv.column || {};
			const cvTitle = cvColumn.title || '';

			// Базовая структура для transformed_column_values
			const newCv = {
				id: cvId,
				value: cvValue,
				text: cvText,
				title: cvTitle,
				additional_info: undefined as string | undefined,
			};

			// Парсим значение колонки
			const parsedValue = MondayParser.parseColumnValue(cvValue, cvType);

			// Добавляем additional_info для определенных типов
			if (cvType === 'status' && parsedValue && typeof parsedValue === 'object') {
				const additionalInfo = {
					label: cvText || parsedValue.label,
					color: '#00c875',
					changed_at: parsedValue.changed_at || '',
				};
				newCv.additional_info = JSON.stringify(additionalInfo);
			} else if (cvType === 'numbers') {
				// Пытаемся получить unit из settings
				try {
					const settings = JSON.parse(cvColumn.settings_str || '{}');
					if (settings.unit) {
						newCv.additional_info = JSON.stringify(settings.unit);
					}
				} catch {
					// Игнорируем ошибки парсинга
				}
			} else if (cvId.startsWith('color_') && parsedValue && typeof parsedValue === 'object') {
				// Специальная обработка для color колонок
				const additionalInfo = {
					label: cvText || parsedValue.label,
					color: parsedValue.color || '#00c875',
					changed_at: parsedValue.changed_at || '',
				};
				newCv.additional_info = JSON.stringify(additionalInfo);
			}

			transformedColumnValues.push(newCv);

			// Создаем mappable_column_values
			const mappableValue = MondayParser.getMappableValue(cv, parsedValue);
			mappableColumnValues[cvId] = mappableValue;
		}

		transformed.column_values = transformedColumnValues;
		transformed.mappable_column_values = mappableColumnValues;

		return transformed;
	}
} 