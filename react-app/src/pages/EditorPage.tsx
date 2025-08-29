import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import articlesService, { CreateArticleData, UpdateArticleData } from '../services/articlesService';

interface ArticleFormData {
  title: string;
  description: string;
  body: string;
  tagList: string;
}

const EditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ArticleFormData>();

  const isEditing = !!slug;

  useEffect(() => {
    if (isEditing && slug) {
      loadArticle();
    }
  }, [slug, isEditing]);

  const loadArticle = async () => {
    if (!slug) return;
    
    try {
      const response = await articlesService.getArticle(slug);
      const article = response.article;
      
      setValue('title', article.title);
      setValue('description', article.description);
      setValue('body', article.body);
      setValue('tagList', article.tagList.join(', '));
    } catch (error) {
      console.error('Failed to load article:', error);
      setError('Failed to load article');
    }
  };

  const onSubmit = async (data: ArticleFormData) => {
    setLoading(true);
    setError('');
    
    try {
      const tagList = data.tagList
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const articleData = {
        title: data.title,
        description: data.description,
        body: data.body,
        tagList,
      };

      let response;
      if (isEditing && slug) {
        response = await articlesService.updateArticle(slug, articleData as UpdateArticleData);
      } else {
        response = await articlesService.createArticle(articleData as CreateArticleData);
      }

      navigate(`/article/${response.article.slug}`);
    } catch (error: any) {
      console.error('Failed to save article:', error);
      setError(error.response?.data?.errors || 'Failed to save article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {error && (
              <ul className="error-messages">
                <li>{error}</li>
              </ul>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    {...register('title', { required: 'Title is required' })}
                  />
                  {errors.title && (
                    <div className="error-message">{errors.title.message}</div>
                  )}
                </fieldset>
                
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    {...register('description', { required: 'Description is required' })}
                  />
                  {errors.description && (
                    <div className="error-message">{errors.description.message}</div>
                  )}
                </fieldset>
                
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                    {...register('body', { required: 'Body is required' })}
                  ></textarea>
                  {errors.body && (
                    <div className="error-message">{errors.body.message}</div>
                  )}
                </fieldset>
                
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags (separated by commas)"
                    {...register('tagList')}
                  />
                </fieldset>
                
                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Publishing...' : 'Publish Article'}
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
