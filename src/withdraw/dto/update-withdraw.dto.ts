import { PartialType } from "@nestjs/mapped-types";
import { CreateWithdrawDto } from "./create-withdraw.dto.js";

export class UpdateWithdrawDto extends PartialType(CreateWithdrawDto) {}
