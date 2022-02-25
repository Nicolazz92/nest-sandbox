import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { FieldOptions } from '@nestjs/graphql/dist/decorators/field.decorator';

export enum MessageType {
  'all' = 'all',
  'warning' = 'warning',
  'error' = 'error',
  'info' = 'info',
  'notification' = 'notification',
  'debug' = 'debug',
  'block' = 'block',
  'unblock' = 'unblock',
}

export type MessageTypeStrings = keyof typeof MessageType;

export class Result {
  @ApiProperty({
    required: true,
  })
  id: string;
  @ApiProperty({
    required: false,
    type: 'object',
  })
  formMessage?: Record<
    string,
    Record<number | MessageTypeStrings, string[] | string[][]>
  >;

  @ApiProperty({
    required: false,
    type: 'object',
  })
  message?: Record<MessageTypeStrings, string[] | string[][]>;

  @Exclude()
  public isError = false;
  @Exclude()
  public isWarning = false;
  /**
   * Устонавливаем сообщение на поле
   * @param type тип сообщения
   * @param field наименования поля
   * @param code код ошибки | строка | uuid localization
   * @param args Дополнительные параметры
   * @returns
   */
  public addMessageField(
    type: MessageType,
    field: string,
    code: string | number,
    ...args: string[]
  ) {
    if (type === MessageType.warning) {
      this.isWarning = true;
    }
    if (type === MessageType.error) {
      this.isError = true;
    }
    if (!this.formMessage) {
      this.formMessage = {};
    }
    if (!this.formMessage[field]) {
      this.formMessage[field] = {} as any;
    }
    if (typeof code === 'number') {
      this.formMessage[field][code] = args || [];
    } else {
      if (!this.formMessage[field][type]) {
        this.formMessage[field][type] = [] as string[];
      }
      (this.formMessage[field][type] as string[][]).push([
        code,
        ...(args || []),
      ]);
    }
    return this;
  }

  public addErrorField(
    field: string,
    code: string | number,
    ...args: string[]
  ) {
    return this.addMessageField(MessageType.error, field, code, ...args);
  }

  /**
   * Устонавливаем сообщение на поле
   * @param type тип сообщения
   * @param field наименования поля
   * @param code код ошибки | строка | uuid localization
   * @param args Дополнительные параметры
   * @returns
   */
  public addMessage(
    type: MessageType,
    code: string | number,
    ...args: string[]
  ) {
    if (type === MessageType.warning) {
      this.isWarning = true;
    }
    if (type === MessageType.error) {
      this.isError = true;
    }
    if (!this.message) {
      this.message = {} as any;
    }
    if (typeof code === 'number') {
      this.message[code] = args || [];
    } else {
      if (!this.message[type]) {
        this.message[type] = [] as string[];
      }
      (this.message[type] as string[][]).push([code, ...(args || [])]);
    }
    return this;
  }

  public addError(code: string | number, ...args: string[]) {
    return this.addMessage(MessageType.error, code, ...args);
  }

  public setId(value: any, name = 'id') {
    this[name] = value;
    return this;
  }
}
