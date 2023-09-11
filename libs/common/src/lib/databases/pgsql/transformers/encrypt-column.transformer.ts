import { ConfigService } from '@nestjs/config';
import { ValueTransformer } from 'typeorm';

import { decryptDeterministic, encryptDeterministic } from '@swiq/common/utils';

import { EncryptionConfig } from '@swiq/common/interfaces';

export default class EncryptColumn implements ValueTransformer {
  static configService: ConfigService;

  /**
   *
   * @param value typeorm entity that will be transformed before sending to db as input
   * @returns transformed value i-e it will be encrypted value in our case (It will be sent with the actual
   *  db request)
   */
  to(value: string) {
    // Get encryptionConfig from ConfigService
    const encryptionConfig = EncryptColumn.configService.get<EncryptionConfig>(
      'encryptionConfig',
      { key: '', iv: '' },
    );

    return encryptDeterministic(
      value,
      encryptionConfig.key,
      encryptionConfig.iv,
    );
  }

  /**
   *
   * @param value typeorm entity that will be transformed after receiving it as a result of query
   * @returns transformed value i-e it will be decrypted value in our case
   */
  from(value: string) {
    // Get encryptionConfig from ConfigService
    const encryptionConfig = EncryptColumn.configService.get<EncryptionConfig>(
      'encryptionConfig',
      { key: '', iv: '' },
    );

    return decryptDeterministic(
      value,
      encryptionConfig.key,
      encryptionConfig.iv,
    );
  }
}
