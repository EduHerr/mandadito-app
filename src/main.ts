import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { SnapshotService } from '@libs/modules/persistent/snapshot/service';
import { SnapshotRepository } from '@libs/modules/persistent/snapshot/repository';

// Arranque explícito de toda la app
async function main() {
  //Inyeccion manual de dependencia
  const snapshotRepository = new SnapshotRepository();
  const snapshotService = new SnapshotService(snapshotRepository);

  await snapshotService.get();

  // 3. Inyectamos la misma instancia a Angular
  await bootstrapApplication(AppComponent, {
    ...appConfig,
    providers: [
      ...(appConfig.providers ?? []),
      { provide: SnapshotService, useValue: snapshotService }
    ]
  });
}

main().catch((err) => console.error(err));
