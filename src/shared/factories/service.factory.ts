export class ServiceFactory {
  private static instances = new Map<string, any>();

  static getInstance<
    T,
    R extends new (...args: any[]) => any,
    D extends any[] = [],
  >(
    ServiceClass: new (repo: InstanceType<R>, ...deps: D) => T,
    RepositoryClass: R,
    ...extraDeps: D
  ): T {
    const key = ServiceClass.name;
    if (!this.instances.has(key)) {
      const repository = new RepositoryClass(...extraDeps);
      this.instances.set(key, new ServiceClass(repository, ...extraDeps));
    }
    return this.instances.get(key);
  }
}
