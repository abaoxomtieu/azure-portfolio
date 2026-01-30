
// Mock objects
const mockFs = {
    existsSync: jest.fn(),
    readdirSync: jest.fn(),
    readFileSync: jest.fn(),
};

const mockRemark = {
    use: jest.fn().mockReturnThis(),
    process: jest.fn().mockResolvedValue({
        toString: () => '<h1>Header</h1>\n<p>Content</p>',
    }),
};

// Apply mocks
jest.mock('fs', () => mockFs);
jest.mock('path', () => {
    const originalPath = jest.requireActual('path');
    return {
        ...originalPath,
        join: (...args: string[]) => args.join('/'),
    };
});
jest.mock('remark', () => ({
    remark: jest.fn().mockReturnValue(mockRemark),
}));
jest.mock('remark-html', () => jest.fn());

describe('markdown utility', () => {
    let getPostSlugs: any;
    let getPostBySlug: any;
    const mockCertsDir = '/cwd/content/certs';

    beforeEach(() => {
        jest.resetModules();
        jest.spyOn(process, 'cwd').mockReturnValue('/cwd');

        // Re-import module
        const markdown = require('./markdown');
        getPostSlugs = markdown.getPostSlugs;
        getPostBySlug = markdown.getPostBySlug;

        // Clear mock calls but keep implementations
        jest.clearAllMocks();
    });

    describe('getPostSlugs', () => {
        it('should return a list of slugs for certs', async () => {
            mockFs.existsSync.mockReturnValue(true);
            mockFs.readdirSync.mockReturnValue(['AZ-900.md', 'AZ-104.md', 'draft.txt']);

            const slugs = await getPostSlugs('certs');
            expect(slugs).toEqual(['AZ-900.md', 'AZ-104.md']);
            expect(mockFs.readdirSync).toHaveBeenCalledWith(mockCertsDir);
        });

        it('should return empty list if directory does not exist', async () => {
            mockFs.existsSync.mockReturnValue(false);
            const slugs = await getPostSlugs('certs');
            expect(slugs).toEqual([]);
        });
    });

    describe('getPostBySlug', () => {
        it('should return post data for a valid slug', async () => {
            mockFs.existsSync.mockReturnValue(true);
            mockFs.readFileSync.mockReturnValue('---\ntitle: Test Title\n---\n# Header\nContent');

            const post = await getPostBySlug('AZ-900', 'certs');

            expect(post.slug).toBe('AZ-900');
            expect(post.title).toBe('Test Title');
            expect(post.content).toBe('<h1>Header</h1>\n<p>Content</p>');
        });

        it('should throw error if file does not exist', async () => {
            mockFs.existsSync.mockReturnValue(false);

            await expect(getPostBySlug('Invalid', 'certs'))
                .rejects
                .toThrow('File not found');
        });
    });
});
