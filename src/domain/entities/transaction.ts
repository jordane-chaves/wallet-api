import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface TransactionProps {
  customerId: UniqueEntityID
  recipientId?: UniqueEntityID | null
  priceInCents: number
  type: 'income' | 'transfer' | 'reverse'
  createdAt: Date
}

export class Transaction extends Entity<TransactionProps> {
  get customerId() {
    return this.props.customerId
  }

  get recipientId() {
    return this.props.recipientId
  }

  get priceInCents() {
    return this.props.priceInCents
  }

  get type() {
    return this.props.type
  }

  set type(type: 'income' | 'transfer' | 'reverse') {
    this.props.type = type
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<TransactionProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const transaction = new Transaction(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return transaction
  }
}
