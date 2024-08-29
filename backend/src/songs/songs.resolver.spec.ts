import { Test, TestingModule } from '@nestjs/testing';
import { SongsResolver } from './songs.resolver';
import { SongsService } from './songs.service';

describe('SongsResolver', () => {
  let resolver: SongsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SongsResolver, SongsService],
    }).compile();

    resolver = module.get<SongsResolver>(SongsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
