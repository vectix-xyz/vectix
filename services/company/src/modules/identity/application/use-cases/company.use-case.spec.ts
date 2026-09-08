import { describe, expect, it, mock } from 'bun:test';

import { CreateCompanyCommand } from '../commands/create-company.command';

import { CompanyUseCase } from './company.use-case';

describe('CompanyUseCase', () => {
  it('should successfully create a company', async () => {
    const mockRepo = {
      existsByTaxCode: mock().mockResolvedValue(false),
      save: mock().mockImplementation(async company => {
        company.id = 'company-uuid-123';
        return company;
      }),
      addMember: mock().mockResolvedValue(undefined),
    };

    const mockUow = {
      companyRepository: mockRepo,
      executeTx: mock().mockImplementation(async work => work(mockUow)),
    };

    const useCase = new CompanyUseCase(mockUow as any);
    const command = new CreateCompanyCommand('user-1', 'Tech Corp', '12345678');

    const result = await useCase.createCompanyWithOwner(command);

    expect(result).toBe('company-uuid-123');
    expect(mockRepo.existsByTaxCode).toHaveBeenCalledWith('12345678');
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
    expect(mockRepo.addMember).toHaveBeenCalledWith(
      'company-uuid-123',
      'user-1',
      'OWNER',
    );
  });

  it('should throw an error if tax code already exists', async () => {
    const mockRepo = {
      existsByTaxCode: mock().mockResolvedValue(true),
      save: mock(),
      addMember: mock(),
    };

    const mockUow = {
      companyRepository: mockRepo,
      executeTx: mock().mockImplementation(async work => work(mockUow)),
    };

    const useCase = new CompanyUseCase(mockUow as any);
    const command = new CreateCompanyCommand('user-1', 'Tech Corp', '12345678');

    expect(useCase.createCompanyWithOwner(command)).rejects.toThrow(
      'Company with this tax code already exists',
    );
    expect(mockRepo.save).not.toHaveBeenCalled();
  });
});
