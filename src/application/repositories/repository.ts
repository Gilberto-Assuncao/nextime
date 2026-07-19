export interface TenantContext { companyId: string; userId: string }
export interface Repository<TEntity, TId> { findById(context: TenantContext, id: TId): Promise<TEntity | null>; list(context: TenantContext): Promise<TEntity[]>; save(context: TenantContext, entity: TEntity): Promise<void> }
