import { Table, Model, Column, CreatedAt, UpdatedAt, DataType, Default, AfterValidate } from "sequelize-typescript";
import * as bcrypt from 'bcryptjs';

@Table
export class User extends Model<User> {
    @Column
    firstname!: string;

    @Column
    lastname!: string;

    @Column(DataType.STRING(1024))
    password!: string;

    @Column(DataType.BOOLEAN)
    email: string;

    @Default(false)
    @Column
    isVerified: boolean;

    @Default('active')
    @Column(DataType.ENUM('active', 'suspended', 'disabled'))
    status: 'active' | 'suspended' | 'disabled';

    @AfterValidate
    static async cryptKey(instance: User){
        const salt = await bcrypt.genSalt(8);
        instance.password = await bcrypt.hash( instance.password, salt);
    }

    @CreatedAt
    @Column
    createdAt!: Date;
  
    @UpdatedAt
    @Column
    updatedAt!: Date;


}