import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articlesApi } from '../services/articles';
import { Article } from '../types';

export const EditorPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEditing = !!slug;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    body: '',
    tagList: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (isEditing && slug) {
      const fetchArticle = async () => {
        try {
          const article = await articlesApi.get(slug);
          setFormData({
            title: article.title,
            description: article.description,
            body: article.body,
            tagList: article.tagList,
          });
        } catch (error) {
          console.error('Failed to fetch article:', error);
          navigate('/');
        }
      };

      fetchArticle();
    }
  }, [isEditing, slug, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!formData.tagList.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tagList: [...prev.tagList, newTag],
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tagList: prev.tagList.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      const articleData = {
        title: formData.title,
        description: formData.description,
        body: formData.body,
        tagList: formData.tagList,
      };

      const article = isEditing && slug
        ? await articlesApi.update(slug, articleData)
        : await articlesApi.create(articleData);

      navigate(`/article/${article.slug}`);
    } catch (error: any) {
      const errorMessages = error.response?.data?.errors || ['An error occurred'];
      setErrors(Object.values(errorMessages).flat() as string[]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {errors.length > 0 && (
              <ul className="error-messages">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}

            <form onSubmit={handleSubmit}>
              <fieldset disabled={isSubmitting}>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="title"
                    placeholder="Article Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    placeholder="What's this article about?"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </fieldset>

                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows={8}
                    name="body"
                    placeholder="Write your article (in markdown)"
                    value={formData.body}
                    onChange={handleInputChange}
                    required
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                  />
                  <div className="tag-list">
                    {formData.tagList.map((tag) => (
                      <span key={tag} className="tag-default tag-pill">
                        <i className="ion-close-round" onClick={() => removeTag(tag)}></i>
                        {tag}
                      </span>
                    ))}
                  </div>
                </fieldset>

                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isEditing ? 'Update Article' : 'Publish Article'}
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
