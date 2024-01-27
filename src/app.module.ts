import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpellcheckModule } from './spellcheck/spellcheck.module';

@Module({
  imports: [SpellcheckModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
