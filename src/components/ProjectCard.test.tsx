import { render, screen } from '@testing-library/react';
import ProjectCard from './ProjectCard';
import '@testing-library/jest-dom';

describe('ProjectCard', () => {
    const defaultProps = {
        title: 'Test Project',
        description: 'This is a test description',
        href: '/test-project',
        type: 'cert' as const,
        index: 0,
    };

    it('renders title and description', () => {
        render(<ProjectCard {...defaultProps} />);

        expect(screen.getByText('Test Project')).toBeInTheDocument();
        expect(screen.getByText('This is a test description')).toBeInTheDocument();
    });

    it('renders certification badge correctly', () => {
        render(<ProjectCard {...defaultProps} type="cert" />);
        expect(screen.getByText('Certification')).toBeInTheDocument();
    });

    it('renders architecture badge correctly', () => {
        render(<ProjectCard {...defaultProps} type="practice" />);
        expect(screen.getByText('Architecture')).toBeInTheDocument();
    });

    it('renders tags if provided', () => {
        const tags = ['Tag1', 'Tag2'];
        render(<ProjectCard {...defaultProps} tags={tags} />);

        expect(screen.getByText('#Tag1')).toBeInTheDocument();
        expect(screen.getByText('#Tag2')).toBeInTheDocument();
    });

    it('links to the correct href', () => {
        render(<ProjectCard {...defaultProps} />);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/test-project');
    });
});
