/**
 * This file containst the template of the DataSourceFile that is generated during the
 * migrations generation process. The variables $ENTITY_IMPORTS and $CONFIG are replaced
 * by the migration script during the execution.
 */

const tempFileTemplate = `
/**
 * This is an auto generate file. DONOT TOUCH. It will be generated while running the migration
 * and it will be removed once migration run is complete
 */

import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

function loadDataSourceConfig(): DataSourceOptions {
    return $CONFIG;
}

export default new DataSource(loadDataSourceConfig());
`;

export default tempFileTemplate;
