import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  BaseEntity,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import {
  IsEmail,
  IsDate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from "class-validator";

@ValidatorConstraint({ name: "checkUniqueEmail", async: true })
class CheckUniqueEmail implements ValidatorConstraintInterface {
  async validate(text: string, args: ValidationArguments) {
    const user = await User.findOne({ email: text });
    return !Boolean(user);
  }

  defaultMessage(args: ValidationArguments) {
    return "This email address has already been registered.";
  }
}

@Entity("users")
export class User extends BaseEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column("varchar", { length: 255, unique: true })
  @IsEmail()
  @Validate(CheckUniqueEmail)
  email: string;

  @Column("varchar", { length: 255, nullable: true })
  firstName: string;

  @Column("varchar", { length: 255, nullable: true })
  lastName: string;

  @Column("text")
  password: string;

  @Column("date", { nullable: true })
  @IsDate()
  joinDate: Date;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
